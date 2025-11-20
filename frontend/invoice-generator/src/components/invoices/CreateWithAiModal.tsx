import { SparklesIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';
import Button from '../ui/Button';
import TextareaField from '../ui/TextareaField';

interface CreateWithAiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateWithAiModal = ({ 
  isOpen, 
  onClose
}: CreateWithAiModalProps
) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please write some text to generate an invoice.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AI.PARSE_INVOICE_TEXT, { text });
      const invoiceData = response.data;

      toast.success("Invoice data extracted successfully.");
      onClose();

      // Navigate to create an invoice page with the parsed data
      navigate("/invoices/new", { state: { aiData: invoiceData } });
    } catch (error) {
      toast.error("Failed to generate invoice from text.");
      console.error("AI parsing error", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div
          className="fixed inset-0 bg-black/10 bg-opacity-50 transition-opacity"
          onClick={onClose}>
        </div>

        <div
          className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative text-left transform"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center">
              <SparklesIcon className="w-5 h-5 mr-2 text-blue-600" />
              Create Invoice with AI
            </h3>

            <button
              onClick={onClose}
              className="text-slate-400"
            >
              &times;
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Paste any text that contains invoice details (like client name, items, quantities, and prices ) and the AI  will attempt to create an invoice from it.
            </p>

            <TextareaField
              name="invoiceText"
              label="Paste invoice text here"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Invoice for clientCorp: 2 hours of design work at $150/hr and 1 logo for $800."
              rows={8}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant='secondary' onClick={onClose}>
              Cancel
            </Button>

            <Button onClick={handleGenerate} isLoading={isLoading}>
              {isLoading ? "Generating..." : "Generate Invoice"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateWithAiModal;