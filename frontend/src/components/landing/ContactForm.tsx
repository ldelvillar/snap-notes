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
    question: 'Name',
    type: 'text',
    id: 'name',
    placeholder: 'Your name',
    required: true,
  },
  {
    question: 'Surname',
    type: 'text',
    id: 'surname',
    placeholder: 'Your surname',
    required: true,
  },
  {
    question: 'Email',
    type: 'email',
    id: 'email',
    placeholder: 'you@example.com',
    required: true,
  },
  {
    question: 'Phone',
    type: 'tel',
    id: 'phone',
    placeholder: '+1 234 567 890',
    pattern: '^(+?d{1,3}s*)?(s*ds*){9}$',
    required: false,
  },
  {
    question: 'Message',
    type: 'textarea',
    id: 'message',
    placeholder: 'How can we help you?',
    required: true,
  },
];

const fieldClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-primary/50 focus:bg-white/8 focus:outline-none';

export default function ContactForm() {
  return (
    <form className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {inputs.map((input, idx) => (
          <div
            key={idx}
            className={input.type === 'textarea' ? 'col-span-full' : ''}
          >
            <label
              htmlFor={input.id}
              className="mb-1.5 block text-sm font-medium text-white/60"
            >
              {input.question}
              {input.required && (
                <span className="ml-1 text-primary">*</span>
              )}
            </label>
            {input.type === 'textarea' ? (
              <textarea
                id={input.id}
                name={input.id}
                placeholder={input.placeholder}
                required={input.required}
                className={`${fieldClass} min-h-32 resize-none`}
              />
            ) : (
              <input
                type={input.type}
                id={input.id}
                name={input.id}
                placeholder={input.placeholder}
                required={input.required}
                className={fieldClass}
                pattern={input.pattern ?? undefined}
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-primary px-6 py-3.5 font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/40 active:scale-95"
      >
        Send message
      </button>
    </form>
  );
}
