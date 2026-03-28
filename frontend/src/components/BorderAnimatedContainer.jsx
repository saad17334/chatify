function BorderAnimatedContainer({ children }) {
    return (
        <div className="p-[2px] rounded-2xl 
        [background:linear-gradient(45deg,#172033,#1e293b_50%,#172033)_padding-box,
        conic-gradient(from_var(--border-angle),
        transparent 70%,
        #06b6d4,
        #67e8f9,
        #06b6d4)_border-box] 
        animate-border">

            <div className="bg-slate-900 rounded-2xl w-full h-full p-4">
                {children}
            </div>

        </div>
    );
}

export default BorderAnimatedContainer;