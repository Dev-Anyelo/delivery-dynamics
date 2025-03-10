export const InfoItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
}) => (
  <div>
    <p className="text-sm font-medium flex items-center gap-2">
      {icon}
      <span>{label}</span>
    </p>
    {value ? (
      <p className="text-sm">{value}</p>
    ) : (
      <p className="text-sm text-muted-foreground">Not specified</p>
    )}
  </div>
);
