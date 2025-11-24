import React from 'react';

const faqs = [
  {
    question: 'What is SAGE Optimizer?',
    answer: 'SAGE is an AI-powered platform that audits and optimizes your website\'s visibility across Search Engines (SEO), Answer Engines (AEO), and Generative Engines (GEO). It helps you rank higher, get discovered in more places, and drive more traffic.',
  },
  {
    question: 'How does the free audit work?',
    answer: 'Our free audit scans your website to identify technical SEO issues, content gaps, and local visibility problems. It provides a high-level overview of your digital presence and shows you where SAGE can help.',
  },
  {
    question: 'What is AEO (Answer Engine Optimization)?',
    answer: 'AEO is the process of optimizing your content to appear in AI-powered answer platforms like Google\'s featured snippets, voice search (Siri, Alexa), and large language models (ChatGPT, Perplexity). SAGE helps you capture this growing source of traffic.',
  },
  {
    question: 'Is SAGE suitable for agencies?',
    answer: 'Yes! Our Agency plan is designed for marketing agencies and includes multi-location management, white-label reporting, and unlimited audits, allowing you to provide powerful optimization services to all your clients.',
  },
  {
    question: 'What is FORGE automation?',
    answer: 'FORGE is our proprietary automation engine that can implement many of the recommended optimizations for you, saving you time and ensuring best practices are followed.',
  },
];

const FAQ = () => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions</h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <div key={faq.question} className="pt-6">
                <dt>
                  <details>
                    <summary className="flex w-full items-start justify-between text-left text-gray-900">
                      <span className="text-base font-semibold leading-7">{faq.question}</span>
                      <span className="ml-6 flex h-7 items-center">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-2 pr-12 text-base leading-7 text-gray-600">{faq.answer}</p>
                  </details>
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
