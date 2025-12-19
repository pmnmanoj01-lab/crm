import { createPortal } from "react-dom";

const ShapeDropdownPortal = ({
  portalRef,
  childCats = [],
  selected = [],
  setFormData,
}) => {
  if (!portalRef?.current) return null;

  return createPortal(
    <div className="absolute left-0 top-full mt-1 w-full z-50 bg-white border border-gray-300 rounded-md shadow-lg max-h-52 overflow-y-auto custom-scroll">
      {childCats.map((child) => {
        const isChecked = selected.includes(child);

        return (
          <label
            key={child}
            className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() =>
                setFormData((prev) => ({
                  ...prev,
                  diamondChildCategory: isChecked
                    ? selected.filter((c) => c !== child)
                    : [...selected, child],
                }))
              }
              className="accent-blue-600"
            />
            <span>{child}</span>
          </label>
        );
      })}
    </div>,
    portalRef.current
  );
};

export default ShapeDropdownPortal;
