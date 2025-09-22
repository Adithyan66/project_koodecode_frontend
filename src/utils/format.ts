

// export const formatTime = (minutes) => {
//   if (minutes < 60) return `${minutes}m`;
//   const hours = Math.floor(minutes / 60);
//   const mins = minutes % 60;
//   return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
// };

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

export  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };