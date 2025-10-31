self.addEventListener('push', function(event) {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  
  let notificationUrl = data.data?.url || '/';
  
  if (data.data?.type) {
    switch (data.data.type) {
      case 'CONTEST_STARTING':
        if (data.data.contestId) {
          notificationUrl = `/contests/${data.data.contestId}`;
        }
        break;
      case 'CONTEST_ENDED':
        if (data.data.contestId) {
          notificationUrl = `/contests/${data.data.contestId}`;
        }
        break;
      case 'CONTEST_REMINDER':
        if (data.data.contestId) {
          notificationUrl = `/contests/${data.data.contestId}`;
        }
        break;
      case 'ACHIEVEMENT':
        notificationUrl = '/profile';
        break;
      case 'FRIEND_REQUEST':
      case 'MENTION':
        if (data.data.url) {
          notificationUrl = data.data.url;
        }
        break;
      case 'ADMIN_ANNOUNCEMENT':
      case 'SYSTEM_ALERT':
        notificationUrl = '/';
        break;
      default:
        notificationUrl = data.data?.url || '/';
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/Icon.svg',
    badge: data.badge || '/Icon.svg',
    data: {
      ...data.data,
      url: notificationUrl
    },
    vibrate: [200, 100, 200],
    tag: data.tag || 'notification',
    requireInteraction: data.requireInteraction || false
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

