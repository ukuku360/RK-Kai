(() => {
  const script = document.currentScript;
  const configuredUrl =
    script?.dataset.kaiUrl ||
    new URL('/?source=roomingkos-site', script?.src || window.location.href).toString();

  if (document.querySelector('[data-kai-toggle-root]')) {
    return;
  }

  const style = document.createElement('style');
  style.textContent = `
    [data-kai-toggle-root] {
      position: fixed;
      right: 22px;
      bottom: 22px;
      z-index: 2147483647;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      min-height: 58px;
      padding: 10px 16px 10px 10px;
      border: 1px solid rgba(19, 22, 20, 0.18);
      border-radius: 999px;
      background: #131614;
      color: #ffffff;
      box-shadow: 0 18px 45px rgba(19, 22, 20, 0.25);
      cursor: pointer;
      font: 700 15px/1.2 Arial, sans-serif;
    }

    [data-kai-toggle-root] span:first-child {
      display: grid;
      width: 38px;
      height: 38px;
      place-items: center;
      border-radius: 50%;
      background: #1d8f79;
      color: #ffffff;
      font-weight: 800;
    }

    [data-kai-toggle-root] small {
      display: block;
      margin-top: 2px;
      color: rgba(255, 255, 255, 0.72);
      font-size: 11px;
      font-weight: 600;
    }

    @media (max-width: 640px) {
      [data-kai-toggle-root] {
        right: 14px;
        bottom: 14px;
      }
    }
  `;

  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('data-kai-toggle-root', '');
  button.setAttribute('aria-label', 'Open Kai room matching assistant');
  button.innerHTML = `
    <span>K</span>
    <strong>Ask Kai<small>AI room matching</small></strong>
  `;

  button.addEventListener('click', () => {
    const url = new URL(configuredUrl, window.location.href);
    if (!url.searchParams.has('source')) {
      url.searchParams.set('source', 'roomingkos-site');
    }
    if (!url.searchParams.has('from')) {
      url.searchParams.set('from', window.location.pathname);
    }
    window.location.href = url.toString();
  });

  document.head.appendChild(style);
  document.body.appendChild(button);
})();
