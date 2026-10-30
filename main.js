function toggleFaq(element) {
  element.classList.toggle('active');
  const answer = element.querySelector('.faq-answer');
  const icon = element.querySelector('.faq-icon');
  
  if (answer) {
    answer.classList.toggle('hidden');
  }
  if (icon) {
    icon.innerText = element.classList.contains('active') ? '−' : '+';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwSp8ks77cP18FOpJgWdyyLiRxuHKYH2-9mdJGUAIuB3LxGyCM4lW9XpVJuPhcuM98e/exec';

  const profileImg = document.getElementById('profile-img');
  if (profileImg) {
    const fallbackSources = ['./img1.png', './img1.jpg', './img1.PNG', './img2.jpg'];
    let fallbackIndex = 0;
    
    profileImg.addEventListener('error', () => {
      fallbackIndex++;
      if (fallbackIndex < fallbackSources.length) {
        profileImg.src = fallbackSources[fallbackIndex];
      }
    });
  }

  const openModal = (id) => {
    const target = document.getElementById(id);
    if (target) target.classList.remove('hidden');
  };

  const closeModal = (id) => {
    const target = document.getElementById(id);
    if (target) target.classList.add('hidden');
  };

  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(trigger.getAttribute('data-modal'));
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(trigger.getAttribute('data-close-modal'));
    });
  });

  document.querySelectorAll('[data-action="waitlist"]').forEach(button => {
    button.addEventListener('click', () => {
      const productName = button.getAttribute('data-product');
      const priceTag = button.getAttribute('data-price') || '73 €';

      const nameEl = document.getElementById('waitlist-product-name');
      const priceEl = document.getElementById('waitlist-price-tag');

      if (nameEl) nameEl.innerText = productName;
      if (priceEl) priceEl.innerText = priceTag;

      openModal('modal-waitlist');
    });
  });

  const waitlistForm = document.getElementById('waitlist-form');
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = waitlistForm.querySelector('input[type="email"]').value;
      const productName = document.getElementById('waitlist-product-name')?.innerText || '';
      const btn = document.getElementById('btn-submit-waitlist');
      const originalText = btn.innerText;

      btn.innerText = 'Registrando... ⏳';
      btn.disabled = true;

      try {
        await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailInput, product: productName })
        });

        btn.innerText = '¡Registrado con éxito! 🎉';
        setTimeout(() => {
          closeModal('modal-waitlist');
          waitlistForm.reset();
          btn.innerText = originalText;
          btn.disabled = false;
        }, 1500);
      } catch (err) {
        alert('Ocurrió un error. Inténtalo de nuevo.');
        btn.innerText = originalText;
        btn.disabled = false;
      }
    });
  }

  const commentForm = document.getElementById('comment-form');
  if (commentForm) {
    commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('comment-name').value;
      const programInput = document.getElementById('comment-program').value;
      const textInput = document.getElementById('comment-text').value;
      const btn = document.getElementById('btn-submit-comment');
      const originalText = btn.innerText;

      btn.innerText = 'Guardando... ⏳';
      btn.disabled = true;

      try {
        await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'comment',
            nombre: nameInput,
            programa: programInput,
            comentario: textInput
          })
        });

        btn.innerText = '¡Gracias! Tu mensaje ha sido registrado ✨';
        setTimeout(() => {
          commentForm.reset();
          btn.innerText = originalText;
          btn.disabled = false;
        }, 3000);
      } catch (err) {
        alert('Ocurrió un error. Por favor inténtalo de nuevo.');
        btn.innerText = originalText;
        btn.disabled = false;
      }
    });
  }
});
