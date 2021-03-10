const API_BASE_ROUTE = "https://canberra-server.herokuapp.com";

const progressbar = {
  /** 
   * Container of progress bar
   * @type {HTMLElement} 
   */
  root: null,

  /**
   * Content element
   * @type {HTMLElement}
   */
  get contentElement() {
      return document.querySelector('main') || null;
  },

  /**
   * Mount state
   * @type {boolean}
   */
  get isMounted() {
      return typeof this.root === 'object' && this.root instanceof HTMLElement;
  },

  /**
   * Mount container 
   * @param {boolean} [disableContent] - Disable content
   * @returns {boolean}
   */
  show(disableContent = false) {
      if (this.isMounted) {
          return false;
      }

      // Progress bar container
      const container = document.createElement('div');
      container.classList.add('progress-bar-container');

      // Progress bar element
      const progressBarElement = document.createElement('div');
      progressBarElement.classList.add('progress-bar');

      // Progress indeterminate element
      const progressElement = document.createElement('div');
      progressElement.classList.add('indeterminate');

      // Append progress element
      progressBarElement.appendChild(progressElement);

      // Append progress bar element
      container.appendChild(progressBarElement);

      document.body.insertBefore(container, document.body.firstChild);

      // Assign root
      this.root = container;

      // Insert 'blur' class name
      if (disableContent === true) {
          const contentElement = this.contentElement;

          if (contentElement instanceof HTMLElement) {
              this.contentElement.classList.add('blur');
          }
      }

      return true;
  },

  /**
   * Unmount progress container
   * @returns {boolean}
   */
  hide() {
      if (this.isMounted) {
          this.root.remove();
          this.root = null;

          // Remove blur effect
          const contentElement = this.contentElement;
          if (contentElement && contentElement instanceof HTMLElement && contentElement.classList.contains('blur')) {
              contentElement.classList.remove('blur');
          }

          return true;
      }
      return false;
  }
};


/**
 * Make API Request 
 * @param {string} method - Method name
 * @param {string} pathname - Pathname
 * @param {object} data - Payload
 * @return {Promise<XMLHttpRequest | any>}
 */
function makeAPIRequest(method = 'GET', pathname = '/test', data = {}) {
  const BASE_ROUTE = API_BASE_ROUTE;

  return new Promise(function (resolve, reject) {
      const request = new XMLHttpRequest();

      request.onreadystatechange = function () {
          if (this.readyState == 4) {
              let body;

              try {
                  if (this.responseText.length > 0) {
                      body = JSON.parse(this.responseText);
                  }
              } catch (err) {
                  return reject(err);
              }
              Reflect.set(request, 'body', body);

              return resolve(request);
          }
      }

      request.open(method, `${BASE_ROUTE}${pathname}`, true);

      request.setRequestHeader('Content-Type', 'application/json');

      if (method !== 'GET') {
          request.send(JSON.stringify(data));
      }
      else {
          request.send();
      }
  })
}

/**
 * Post data object
 * @param {string} pathname - Pathname
 * @param {object} payload - Payload
 * @returns {Promise<string>}
 */
function submitPayload(pathname = '/test', payload = {}) {
  return new Promise(function (resolve, reject) {
      let message, erroMessage;

      makeAPIRequest('POST', pathname, payload)
          .then(function (res) {
              message = res.body.message;

              if (!(res.status == 200 || res.status == 201)) {
                reject(message);
              }
              return resolve(message);
          })
          .catch(function (err) {
            erroMessage = err.message;
            return reject(erroMessage);
          })
          .finally(function () {
              alert(message);
          })
  });
}
