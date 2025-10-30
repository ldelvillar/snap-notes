interface InputsData {
  question: string;
  type: "text" | "email" | "tel" | "textarea";
  id: string;
  placeholder: string;
  pattern?: string;
  required: boolean;
}

const inputs: InputsData[] = [
  {
    question: "Name*",
    type: "text",
    id: "name",
    placeholder: "Type your name",
    required: true,
  },
  {
    question: "Surname*",
    type: "text",
    id: "surname",
    placeholder: "Type your surname",
    required: true,
  },
  {
    question: "Email*",
    type: "email",
    id: "email",
    placeholder: "Type your email",
    required: true,
  },
  {
    question: "Phone",
    type: "tel",
    id: "phone",
    placeholder: "Type your phone number",
    pattern: "^(+?d{1,3}s*)?(s*ds*){9}$",
    required: false,
  },
  {
    question: "Message",
    type: "textarea",
    id: "message",
    placeholder: "Type your message",
    required: false,
  },
];

export default function ContactForm() {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inputs.map((input, idx) => (
          <div
            key={idx}
            className={`text-gray-200 ${
              input.type === "textarea" ? "col-span-full" : ""
            }`}
          >
            <label
              htmlFor={input.id}
              className="block mb-2 font-bold text-xl text-primary"
            >
              {input.question}
            </label>
            {input.type === "textarea" ? (
              <textarea
                id={input.id}
                name={input.id}
                placeholder={input.placeholder}
                required={input.required}
                className="bg-transparent w-full h-32 pt-4 pb-2 border-b border-gray-300 focus:outline-none focus:border-primary/70 placeholder:font-semibold"
              />
            ) : (
              <input
                type={input.type}
                id={input.id}
                name={input.id}
                placeholder={input.placeholder}
                required={input.required}
                className="bg-transparent w-full pt-4 pb-2 border-b border-gray-300 focus:outline-none focus:border-primary/70 placeholder:font-semibold"
                pattern={input.pattern ? input.pattern : undefined}
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="bg-primary text-white text-lg px-6 py-3 w-full rounded-md hover:bg-primary/90 transition duration-300"
      >
        Send
      </button>
    </form>
  );
}
