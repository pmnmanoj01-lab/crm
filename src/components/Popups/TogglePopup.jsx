const StatusToggle = ({ value, onChange, disabled }) => {
    return (
        <button
            onClick={() => !disabled && onChange(!value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition
                ${value ? "bg-green-600" : "bg-gray-300"}
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition
                    ${value ? "translate-x-6" : "translate-x-1"}
                `}
            />
        </button>
    );
};

export default StatusToggle
