function computeAngle(C, x, y) {
    const dx = x - C[0];
    const dy = y - C[1];
    return Math.atan2(-dy, dx);
}

function normalizeAngle(theta) {
    theta = theta % (2 * Math.PI);
    return theta >= 0 ? theta : theta + 2 * Math.PI;
}

function intersectEdgeWithCircle(P0, P1, C, R) {
    const dx = P1[0] - P0[0];
    const dy = P1[1] - P0[1];
    const a = dx * dx + dy * dy;
    if (a === 0) return [];
    const cx = C[0];
    const cy = C[1];
    const b = 2 * (dx * (P0[0] - cx) + dy * (P0[1] - cy));
    const c = (P0[0] - cx) ** 2 + (P0[1] - cy) ** 2 - R * R;
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return [];
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const s1 = (-b + sqrtDiscriminant) / (2 * a);
    const s2 = (-b - sqrtDiscriminant) / (2 * a);
    const intersections = [];
    if (s1 >= 0 && s1 <= 1) {
        intersections.push({ s: s1, x: P0[0] + s1 * dx, y: P0[1] + s1 * dy });
    }
    if (s2 >= 0 && s2 <= 1 && s2 !== s1) {
        intersections.push({ s: s2, x: P0[0] + s2 * dx, y: P0[1] + s2 * dy });
    }
    intersections.sort((a, b) => a.s - b.s);
    return intersections;
}

function processEdge(P0, P1, C, R, blockedIntervals) {
    const intersections = intersectEdgeWithCircle(P0, P1, C, R);
    const d0 = pointDist(P0, C);
    const d1 = pointDist(P1, C);
    const p0Inside = d0 <= R;
    const p1Inside = d1 <= R;
    const points = [];
    if (p0Inside) {
        const theta = normalizeAngle(computeAngle(C, P0[0], P0[1]));
        points.push({ s: 0, theta });
    }
    if (p1Inside) {
        const theta = normalizeAngle(computeAngle(C, P1[0], P1[1]));
        points.push({ s: 1, theta });
    }
    intersections.forEach(inter => {
        const theta = normalizeAngle(computeAngle(C, inter.x, inter.y));
        points.push({ s: inter.s, theta });
    });
    points.sort((a, b) => a.s - b.s);
    if (points.length === 0 && p0Inside && p1Inside) {
        const start = normalizeAngle(computeAngle(C, P0[0], P0[1]));
        const end = normalizeAngle(computeAngle(C, P1[0], P1[1]));
        blockedIntervals.push(...adjustInterval(start, end));
        return;
    }
    for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        const midS = (a.s + b.s) / 2;
        const midX = P0[0] + midS * (P1[0] - P0[0]);
        const midY = P0[1] + midS * (P1[1] - P0[1]);
        const midDist = Math.hypot(midX - C[0], midY - C[1]);
        if (midDist <= R) {
            blockedIntervals.push(...adjustInterval(a.theta, b.theta));
        }
    }
}

function adjustInterval(start, end) {
    start = normalizeAngle(start);
    end = normalizeAngle(end);
    if (start <= end) {
        return [{ start, end }];
    } else {
        return [{ start, end: end + 2 * Math.PI }, { start: 0, end }];
    }
}

function mergeIntervals(intervals) {
    if (intervals.length === 0) return [];
    const sorted = intervals.slice().sort((a, b) => a.start - b.start);
    const merged = [sorted[0]];
    for (let i = 1; i < sorted.length; i++) {
        const last = merged[merged.length - 1];
        const current = sorted[i];
        if (current.start <= last.end) {
            last.end = Math.max(last.end, current.end);
        } else {
            merged.push(current);
        }
    }
    return merged.map(interval => ({
        start: normalizeAngle(interval.start),
        end: normalizeAngle(interval.end),
    }));
}

function subtractIntervals(originalStart, originalEnd, blocked) {
    originalStart = normalizeAngle(originalStart);
    originalEnd = normalizeAngle(originalEnd);
    let wrapped = originalEnd < originalStart;
    if (wrapped) originalEnd += 2 * Math.PI;
    const visible = [];
    let pos = originalStart;
    for (const block of blocked) {
        let start = normalizeAngle(block.start);
        let end = normalizeAngle(block.end);
        if (end < start) end += 2 * Math.PI;
        if (start > originalEnd && end > originalEnd) continue;
        if (end < originalStart && start < originalStart) continue;
        start = Math.max(start, originalStart);
        end = Math.min(end, originalEnd);
        if (start > end) continue;
        if (pos < start) {
            visible.push({ start: pos, end: start });
        }
        pos = Math.max(pos, end);
    }
    if (pos < originalEnd) {
        visible.push({ start: pos, end: originalEnd });
    }
    return visible.map(interval => ({
        start: normalizeAngle(interval.start),
        end: normalizeAngle(interval.end),
    })).filter(interval => interval.start !== interval.end);
}

function getVisibleArcs(polygons, center, radius, startAngle, endAngle) {
    const blocked = [];
    polygons.forEach(polygon => {
        for (let i = 0; i < polygon.length; i++) {
            const P0 = polygon[i];
            const P1 = polygon[(i + 1) % polygon.length];
            processEdge(P0, P1, center, radius, blocked);
        }
    });
    const merged = mergeIntervals(blocked);
    
    const visible = subtractIntervals(startAngle, endAngle, merged);
    return visible.map(arc => [arc.start, arc.end]);
}

function hitboxListFromParts(parts) {
    let list = []
    for (let part of parts) {
        let polys = spriteData[part.ID].hitboxes
        for (let poly of polys) {
            list.push(translatedPoly(poly, part.Location))
        }
    }
    return [...list]
}
