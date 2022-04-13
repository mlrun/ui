export const getTransitionEndEventName = () => {
  var transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
  }
  let bodyStyle = document.body.style
  for (let transition in transitions) {
    if (bodyStyle[transition] !== undefined) {
      return transitions[transition]
    }
  }
}
