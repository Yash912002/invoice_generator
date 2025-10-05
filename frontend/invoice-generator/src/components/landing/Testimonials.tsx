import { QuoteIcon } from "lucide-react"
import { TESTOMONIALS } from "../../utils/data"

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            What our customers say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are trusted by thousands of small businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTOMONIALS.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 relative">
              <div className="absolute -top-4 left-8 w-8 h-8 bg-gradient-to-br from-blue-950 to-blue-900 rounded-full">
                <QuoteIcon className="" />
              </div>

              <p className="">"{testimonial.quote}"</p>

              <div className="">
                <img src={testimonial.avatar} alt={testimonial.author} className="" />

                <div className="">
                  <p className="">{testimonial.author}</p>
                  <p className="">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials