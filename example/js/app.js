if (true) {
  console.log('These');
  console.warn('console');
  console.error('statements');
  logger.emergency({
    will: 1111,
    removed: 'true'
  });
  logger.alert('except for this one!');/*remove-calls:skip*/
}
