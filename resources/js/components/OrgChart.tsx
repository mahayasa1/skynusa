import { useEffect, useRef, useState } from "react";

export interface TeamPerson {
    id: number;
    name: string;
    role: string;
    sub_role: string | null;
    photo: string;
}

export interface TeamTree {
    ceo: TeamPerson | null;
    management: TeamPerson[];
    staff: TeamPerson[];
}

// ── SVG Connector ──────────────────────────────────────────────
function OrgConnector({
    parentRef,
    childRefs,
    containerRef,
}: {
    parentRef: React.RefObject<HTMLDivElement | null>;
    childRefs: React.RefObject<HTMLDivElement | null>[];
    containerRef: React.RefObject<HTMLDivElement | null>;
}) {
    const [paths, setPaths] = useState<string[]>([]);
    const [svgBox, setSvgBox] = useState({ width: 0, height: 0, top: 0 });

    useEffect(() => {
        const compute = () => {
            if (!parentRef.current || !containerRef.current) return;
            const validChildren = childRefs.filter(r => r.current);
            if (validChildren.length === 0) return;

            const container = containerRef.current.getBoundingClientRect();
            const parent = parentRef.current.getBoundingClientRect();

            // parent bottom center (relative to container)
            const px = parent.left + parent.width / 2 - container.left;
            const py = parent.bottom - container.top;

            // child top centers
            const children = validChildren.map(r => {
                const rect = r.current!.getBoundingClientRect();
                return {
                    cx: rect.left + rect.width / 2 - container.left,
                    cy: rect.top - container.top,
                };
            });

            const minCX = Math.min(...children.map(c => c.cx));
            const maxCX = Math.max(...children.map(c => c.cx));
            const midY = py + 20; // the horizontal bar Y

            const newPaths: string[] = [];

            // vertical from parent to bar
            newPaths.push(`M ${px} ${py} L ${px} ${midY}`);

            // horizontal bar across all children
            if (children.length > 1) {
                newPaths.push(`M ${minCX} ${midY} L ${maxCX} ${midY}`);
            }

            // vertical drops from bar to each child
            children.forEach(c => {
                newPaths.push(`M ${c.cx} ${midY} L ${c.cx} ${c.cy}`);
            });

            // SVG bounding box
            const maxY = Math.max(...children.map(c => c.cy));
            setSvgBox({ width: container.width, height: maxY + 2, top: container.top });
            setPaths(newPaths);
        };

        compute();

        const observer = new ResizeObserver(compute);
        if (containerRef.current) observer.observe(containerRef.current);
        window.addEventListener('resize', compute);
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', compute);
        };
    }, []);

    if (paths.length === 0) return null;

    return (
        <svg
            aria-hidden="true"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: svgBox.width,
                height: svgBox.height,
                pointerEvents: 'none',
                overflow: 'visible',
                zIndex: 0,
            }}
        >
            {paths.map((d, i) => (
                <path key={i} d={d} stroke="#CBD5E1" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            ))}
        </svg>
    );
}

// ── Node Card ──────────────────────────────────────────────────
const NodeCard = ({
    ref: _ref,
    img, name, role, sub, isCeo = false,
}: {
    ref?: React.RefObject<HTMLDivElement | null>;
    img: string; name: string; role?: string; sub?: string; isCeo?: boolean;
}) => (
    <div
        className={`flex flex-col items-center text-center bg-white rounded-xl p-3 sm:p-4 relative z-10 ${isCeo
                ? 'border-2 border-blue-600 shadow-lg w-36 sm:w-44'
                : 'border border-gray-200 shadow-sm w-28 sm:w-32 hover:shadow-md transition-shadow'
            }`}
    >
        <img
            src={img}
            alt={name}
            onError={(e) => {
                (e.target as HTMLImageElement).src = '/asset/profile.png';
            }}
            className={`rounded-full object-cover mb-2 ${isCeo ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-12 h-12 sm:w-14 sm:h-14'}`}
        />
        <p className="text-xs font-bold text-gray-900 leading-tight">{name}</p>
        {role && <p className="text-xs font-semibold text-blue-600 leading-tight mt-0.5">{role}</p>}
        {sub && <p className="text-xs text-gray-500 leading-tight">{sub}</p>}
    </div>
);

// ── Main OrgChart Component ────────────────────────────────────
// Data tim diedit di Admin > Tim.
export default function OrgChart({ teamVisible, team }: { teamVisible: boolean; team?: TeamTree }) {
    const ceo = team?.ceo ?? null;
    const mgmt = team?.management ?? [];
    const staff = team?.staff ?? [];

    const containerRef = useRef<HTMLDivElement>(null);
    const ceoRef = useRef<HTMLDivElement>(null);
    const mgmtEls = useRef<(HTMLDivElement | null)[]>([]);
    const staffEls = useRef<(HTMLDivElement | null)[]>([]);

    // Objek mirip ref supaya OrgConnector tetap bisa membaca elemen terbaru.
    const asRefs = (els: React.RefObject<(HTMLDivElement | null)[]>, n: number) =>
        Array.from({ length: n }, (_, i) => ({
            get current() {
                return els.current?.[i] ?? null;
            },
        })) as React.RefObject<HTMLDivElement | null>[];
    const mgmtRefs = asRefs(mgmtEls, mgmt.length);
    const staffRefs = asRefs(staffEls, staff.length);
    const midMgmtRef = mgmtRefs[Math.floor(mgmtRefs.length / 2)];

    // Delay=0 for lines to render after mount
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(t);
    }, []);

    const delays = ['', 'd100', 'd200', 'd300', 'd400', 'd500'];
    const signature = `${ceo?.id ?? 0}-${mgmt.map((m) => m.id).join(',')}-${staff.map((m) => m.id).join(',')}`;

    if (!ceo && mgmt.length === 0 && staff.length === 0) {
        return <p className="text-center text-sm text-gray-500">Data tim belum tersedia.</p>;
    }

    return (
        <div ref={containerRef} className="flex flex-col items-center" style={{ position: 'relative' }}>

            {/* CEO */}
            {ceo && (
                <>
                    <div
                        ref={ceoRef}
                        className={`relative z-10 ${teamVisible ? 'anim-down hidden-init d100' : 'hidden-init'}`}
                    >
                        <NodeCard img={ceo.photo} name={ceo.name} role={ceo.role} sub={ceo.sub_role ?? undefined} isCeo />
                    </div>
                    <div style={{ height: 40 }} />
                </>
            )}

            {/* Management tier */}
            {mgmt.length > 0 && (
                <>
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 relative z-10 w-full">
                        {mgmt.map((m, i) => (
                            <div
                                key={m.id}
                                ref={(el) => {
                                    mgmtEls.current[i] = el;
                                }}
                                className={teamVisible ? `anim-up hidden-init ${delays[Math.min(i, 5)]}` : 'hidden-init'}
                            >
                                <NodeCard img={m.photo} name={m.name} role={m.role} sub={m.sub_role ?? undefined} />
                            </div>
                        ))}
                    </div>
                    <div style={{ height: 40 }} />
                </>
            )}

            {/* Staff tier */}
            {staff.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 relative z-10 w-full">
                    {staff.map((m, i) => (
                        <div
                            key={m.id}
                            ref={(el) => {
                                staffEls.current[i] = el;
                            }}
                            className={teamVisible ? `anim-scale hidden-init ${delays[Math.min(i + 4, 5)]}` : 'hidden-init'}
                        >
                            <NodeCard img={m.photo} name={m.name} sub={m.role} />
                        </div>
                    ))}
                </div>
            )}

            {/* SVG Connectors — drawn after mount */}
            {mounted && (
                <div key={signature}>
                    {ceo && mgmt.length > 0 && (
                        <OrgConnector parentRef={ceoRef} childRefs={mgmtRefs} containerRef={containerRef} />
                    )}
                    {midMgmtRef && staff.length > 0 && (
                        <OrgConnector parentRef={midMgmtRef} childRefs={staffRefs} containerRef={containerRef} />
                    )}
                </div>
            )}
        </div>
    );
}
