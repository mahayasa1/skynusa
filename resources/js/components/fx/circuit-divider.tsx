/** Pembatas section bergaya jalur sirkuit. Dekoratif saja. */
export default function CircuitDivider({ className = '' }: { className?: string }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 1200 24"
            preserveAspectRatio="none"
            className={`block h-5 w-full ${className}`}
        >
            <defs>
                <linearGradient id="cd-fade" x1="0" x2="1">
                    <stop offset="0" stopColor="#20c9f5" stopOpacity="0" />
                    <stop offset="0.5" stopColor="#268bff" stopOpacity="0.7" />
                    <stop offset="1" stopColor="#20c9f5" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path
                d="M0 12 H430 L450 4 H540 L556 12 H644 L660 20 H750 L770 12 H1200"
                fill="none"
                stroke="url(#cd-fade)"
                strokeWidth="1.5"
            />
            {[450, 540, 660, 750].map((x, i) => (
                <circle key={x} cx={x} cy={i % 2 ? 20 : 4} r="3" fill="#fff" stroke="#268bff" strokeWidth="1.5" />
            ))}
        </svg>
    );
}
