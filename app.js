document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  const ticketForm = document.querySelector('#ticketForm');
  const formSuccess = document.querySelector('#formSuccess');
  const ticketReference = document.querySelector('#ticketReference');
  const ticketList = document.querySelector('#ticketList');
  const emptyState = document.querySelector('#emptyState');
  const tabs = document.querySelectorAll('.tab-button');


  function renderTicket(ticket) {
    const row = document.createElement('article');
    row.className = 'ticket-row';
    row.dataset.status = 'open';
    row.innerHTML = `<div class="ticket-status open"><i data-lucide="loader-circle"></i></div><div class="ticket-summary"><div class="ticket-meta"><span>${ticket.reference}</span><span>${ticket.topic}</span></div><h3>${ticket.message}</h3><p>Submitted just now · Awaiting team reply</p></div><span class="row-action">View ticket <i data-lucide="arrow-up-right"></i></span>`;
    ticketList.prepend(row);
  }

  lucide.createIcons();

 ticketForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const data = new FormData(ticketForm);

  const ticketData = {
    name: data.get('name'),
    email: data.get('email'),
    topic: data.get('topic'),
    message: data.get('message')
  };

  try {
    const response = await fetch('/.netlify/functions/create-ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ticketData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Ticket could not be submitted');
    }

    ticketReference.textContent = result.id;
    formSuccess.classList.add('visible');
    ticketForm.reset();

    const ticket = {
      reference: result.id,
      topic: result.topic,
      message: result.message
    };

    renderTicket(ticket);
    updateCounts();
    lucide.createIcons();

    setTimeout(() => {
      document.querySelector('#responses').scrollIntoView({
        behavior: 'smooth'
      });
    }, 450);
  } catch (error) {
    console.error(error);
    alert('Your ticket could not be submitted. Please try again.');
  }
});

  function updateCounts() {
    const rows = [...document.querySelectorAll('.ticket-row')];
    document.querySelector('#allCount').textContent = rows.length;
    document.querySelector('#openCount').textContent = rows.filter(row => row.dataset.status === 'open').length;
  }

  function filterTickets(filter) {
    const rows = [...document.querySelectorAll('.ticket-row')];
    let visible = 0;
    rows.forEach(row => {
      const show = filter === 'all' || row.dataset.status === filter;
      row.style.display = show ? 'flex' : 'none';
      if (show) visible += 1;
    });
    emptyState.style.display = visible ? 'none' : 'block';
  }

  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(button => button.classList.remove('active'));
    tab.classList.add('active');
    filterTickets(tab.dataset.filter);
  }));

  updateCounts();
});
