interface InputsData {
  question: string;
  type: 'text' | 'email' | 'tel' | 'textarea';
  id: string;
  placeholder: string;
  pattern?: string;
  required: boolean;
}

const inputs: InputsData[] = [
  {
    question: 'Name*',
    type: 'text',
    id: 'name',
    placeholder: 'Type your name',
    required: true,
  },
  {
    question: 'Surname*',
    type: 'text',
    id: 'surname',
    placeholder: 'Type your surname',
    required: true,
  },
  {
    question: 'Email*',
    type: 'email',
    id: 'email',
    placeholder: 'Type your email',
    required: true,
  },
  {
    question: 'Phone',
    type: 'tel',
    id: 'phone',
    placeholder: 'Type your phone number',
    pattern: '^(+?d{1,3}s*)?(s*ds*){9}$',
    required: false,
  },
  {
    question: 'Message',
    type: 'textarea',
    id: 'message',
    placeholder: 'Type your message',
    required: false,
  },
];

export default function ContactForm() {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {inputs.map((input, idx) => (
          <div
            key={idx}
            className={`text-gray-200 ${
              input.type === 'textarea' ? 'col-span-full' : ''
            }`}
          >
            <label
              htmlFor={input.id}
              className="mb-2 block text-xl font-bold text-primary"
            >
              {input.question}
            </label>
            {input.type === 'textarea' ? (
              <textarea
                id={input.id}
                name={input.id}
                placeholder={input.placeholder}
                required={input.required}
                className="h-32 w-full border-b border-gray-300 bg-transparent pt-4 pb-2 placeholder:font-semibold focus:border-primary/70 focus:outline-none"
              />
            ) : (
              <input
                type={input.type}
                id={input.id}
                name={input.id}
                placeholder={input.placeholder}
                required={input.required}
                className="w-full border-b border-gray-300 bg-transparent pt-4 pb-2 placeholder:font-semibold focus:border-primary/70 focus:outline-none"
                pattern={input.pattern ? input.pattern : undefined}
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-primary px-6 py-3 text-lg text-white transition duration-300 hover:bg-primary/90"
      >
        Send
      </button>
    </form>
  );
}
