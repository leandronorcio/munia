import SidebarMenuItem from './SidebarMenuItem';

export default function Navbar() {
  return (
    <div className="flex flex-col w-72 py-9 px-8 last-child:mt-auto">
      {[
        { src: '/grid-feed-cards.svg', title: 'News Feed' },
        { src: '/mail.svg', title: 'Messages' },
        {
          src: '/notification-bell.svg',
          title: 'Notifications',
        },
        {
          src: '/two-people.svg',
          title: 'Meetups',
          className: 'mb-auto',
        },
        { src: '/log-out-circle.svg', title: 'Logout', className: 'mt-auto' },
      ].map((item, i) => (
        <SidebarMenuItem src={item.src} className={item.className} key={i}>
          {item.title}
        </SidebarMenuItem>
      ))}
    </div>
  );
}
