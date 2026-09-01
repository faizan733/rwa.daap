import ReactDOM from 'react-dom';

export function createRoot(container) {
  return {
    render(element) {
      return ReactDOM.render(element, container);
    },
    unmount() {
      return ReactDOM.unmountComponentAtNode(container);
    },
  };
}

export function hydrateRoot(container, element) {
  ReactDOM.hydrate(element, container);
  return createRoot(container);
}
