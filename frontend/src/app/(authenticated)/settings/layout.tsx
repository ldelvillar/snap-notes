import SettingsNavbar from '@/components/SettingsNavbar';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SettingsNavbar>{children}</SettingsNavbar>
    </div>
  );
}
