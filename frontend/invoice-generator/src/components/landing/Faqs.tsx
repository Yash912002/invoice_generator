import { useState } from "react";
import { FAQS } from "../../utils/data";
import { ChevronDownIcon } from "lucide-react";

type FAQ = {
  question: string;
  answer: string;
}

type FaqItemProps = {
  faq: FAQ;
  isOpen: boolean;
  onClick: () => void
}

const FaqItem = ({ faq, isOpen, onClick }: FaqItemProps) => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={onClick} className="w-full flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100 cursor-pointer">
        <span className="text-lg font-medium text-gray-900 pr-4 text-left">
          {faq.question}
        </span>
        <ChevronDownIcon
          className={
            `w-6 h-6 text-gray-400 transition-transform duration-300 
            ${isOpen ? "transform rotate-180" : ""}`
          }
        />
      </button>

      {isOpen && (
        <div className="p-6 text-gray-600 leading-relaxed border-t border-gray-100">
          {faq.answer}
        </div>
      )}
    </div>
  )
}

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex == index ? null : index);
  }
  return (
    <section id="faq" className="py-20 lg:py-28 bg-white">
      <div className="max-`w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about product and billing
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <FaqItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Faqs