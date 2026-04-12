async function load() {
  
  await addcomp('navbar-placeholder', './comps/nav.html');
  await addcomp('searchbar-placeholder', './comps/searchbar.html');
  
  await searchjsfunc();
  await addcomp('faqcomp-placeholder', './comps/faqcomp.html');
  
  await qna();
  
  await addcomp('footer-placeholder', './comps/footer.html');

}

load()







function qna() {
  const faqs = [
  {
    question: "What is your return policy?",
    answer: "We accept returns within 7 days of delivery. Items must be unused and in original packaging."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping takes 3–5 business days. Express options are available at checkout."
  },
  {
    question: "Do you offer custom orders?",
    answer: "Yes! Reach out to us via the contact page and we'll be happy to discuss custom pieces."
  },
];

const list = document.getElementById('faq-list');

faqs.forEach(({ question, answer }) => {
  const item = document.createElement('div');
  item.className = 'faq-item';

  item.innerHTML = `
    <button class="faq-question">${question}</button>
    <div class="faq-answer">${answer}</div>
  `;

  item.querySelector('.faq-question').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

    // Re-open if it wasn't already open
    if (!isOpen) item.classList.add('open');
  });

  list.appendChild(item);
});
}