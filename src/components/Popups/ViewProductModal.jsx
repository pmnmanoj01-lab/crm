import { useEffect } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

/* ------------------
   Reusable Components
------------------- */

const Field = ({ label, value }) => {
  if (value === null || value === undefined || value === "") return null;

  return (
    <div className="flex flex-col md:flex-row items-center">
      <span className="font-medium break-words">{label}</span>
      <span className="break-words text-gray-500"> : {value}</span>
    </div>
  );
};

const Section = ({ title, children, visible = true }) => {
  if (!visible) return null;

  return (
    <div className="border rounded-xl border-gray-200 p-4 bg-gray-50 shadow-sm">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
        {children}
      </div>
    </div>
  );
};

/* ------------------
   Modal Component
------------------- */

const ViewProductModal = ({ open, onClose, product }) => {
  if (!open || !product) return null;

  useEffect(() => {
    const closeOnEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEsc);
    return () => window.removeEventListener("keydown", closeOnEsc);
  }, [onClose]);

  const casting = product;
  const filing = product?.filing?.[0];
  const prepolish = product?.prepolish?.[0];
  const setting = product?.setting?.[0];
  const polish = product?.polish?.[0];
  const repair = product?.repair?.[0];

  const hasData = (obj) => obj && Object.values(obj).some(Boolean);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 cursor-pointer rounded-full">
            <X />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto space-y-6">
          <Section title="Casting" visible={hasData(casting)}>
            <Field label="Material" value={casting.material} />
            <Field label="Sub Category" value={casting.subCategory} />
            <Field label="Child Category" value={casting.childCategory} />
            <Field label="Weight Provided" value={casting.weightProvided} />
            <Field label="Returned Weight" value={casting.returnedWeight} />
            <Field label="Weight Loss" value={casting.weightLoss} />
            <Field label="User" value={casting?.user?.[0]?.name} />
            <Field
              label="Created At"
              value={new Date(casting.updatedAt || casting.createdAt).toLocaleString()}
            />
          </Section>

          <Section title="Filing" visible={hasData(filing)}>
            <Field label="Material" value={filing?.material} />
            <Field label="Sub Category" value={filing?.subCategory} />
            <Field label="Child Category" value={filing?.childCategory} />
            <Field label="Weight Provided" value={filing?.weightProvided} />
            <Field label="Returned Weight" value={filing?.returnedWeight} />
            <Field label="Extra Material" value={filing?.extraMaterialWeight} />
            <Field label="Weight Loss" value={filing?.weightLoss} />
            <Field label="User" value={filing?.user?.name} />
            <Field
              label="Created At"
              value={new Date(filing?.updatedAt || filing?.createdAt || product?.updatedAt).toLocaleString()}
            />
          </Section>

          <Section title="Pre Polish" visible={hasData(prepolish)}>
            <Field label="Weight Provided" value={prepolish?.weightProvided} />
            <Field label="Returned Weight" value={prepolish?.returnedWeight} />
            <Field label="Weight Loss" value={prepolish?.weightLoss} />
            <Field label="User" value={prepolish?.user?.name} />
            <Field
              label="Created At"
              value={new Date(prepolish?.updatedAt || prepolish?.createdAt || product?.updatedAt).toLocaleString()}
            />
          </Section>

          <Section title="Setting" visible={hasData(setting)}>
            <Field label="Diamond Category" value={setting?.diamondCategory} />
            <Field label="Diamond Type" value={setting?.diamondSubCategory} />
            <Field label="Shape" value={setting?.diamondChildCategory} />
            <Field label="Dimensions" value={setting?.diamondDimenssion} />
            <Field label="Pieces" value={setting?.diamondPices} />
            <Field label="Diamond Weight" value={setting?.diamondWeight} />
            <Field label="Weight Provided" value={setting?.weightProvided} />
            <Field label="Returned Weight" value={setting?.returnedWeight} />
            <Field label="Weight Loss" value={setting?.weightLoss} />
            <Field label="User" value={setting?.user?.name} />
          </Section>

          <Section title="Polish" visible={hasData(polish)}>
            <Field label="Material" value={polish?.material} />
            <Field label="Sub Category" value={polish?.subCategory} />
            <Field label="Child Category" value={polish?.childCategory} />
            <Field label="Weight Provided" value={polish?.weightProvided} />
            <Field label="Returned Weight" value={polish?.returnedWeight} />
            <Field label="Extra Material" value={polish?.extraMaterialWeight} />
            <Field label="Weight Loss" value={polish?.weightLoss} />
            <Field label="User" value={polish?.user?.name} />
          </Section>

          <Section title="Repair" visible={hasData(repair)}>
            <Field label="Material" value={repair?.material} />
            <Field label="Sub Category" value={repair?.subCategory} />
            <Field label="Child Category" value={repair?.childCategory} />
            <Field label="Weight Provided" value={repair?.weightProvided} />
            <Field label="Returned Weight" value={repair?.returnedWeight} />
            <Field label="Extra Material" value={repair?.extraMaterialWeight} />
            <Field label="Weight Loss" value={repair?.weightLoss} />
            <Field label="User" value={repair?.user?.name} />
          </Section>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 cursor-pointer rounded-lg bg-gray-800 text-white hover:bg-black"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ViewProductModal;