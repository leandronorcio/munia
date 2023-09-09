export const commentFramerVariants = {
  start: {
    x: 50,
    marginTop: '0px',
    overflow: 'hidden',
  },
  animate: {
    x: 0,
    marginTop: '6px',
    overflow: 'visible',
  },
  exit: {
    height: 0,
    opacity: 0,
    marginTop: '0px',
    overflow: 'hidden',
  },
};

export const postFramerVariants = {
  start: {
    y: '-50',
    opacity: 0,
    marginTop: '0px',
    overflow: 'hidden',
  },
  animate: {
    y: 0,
    opacity: 1,
    marginTop: '16px',
    overflow: 'visible',
  },
  exit: {
    height: 0,
    opacity: 0,
    marginTop: '0px',
    overflow: 'hidden',
  },
};
