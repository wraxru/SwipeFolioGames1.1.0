interface SectionHeaderProps {
  title: string;
  showSeeAll?: boolean;
  onSeeAllClick?: () => void;
}

export default function SectionHeader({
  title,
  showSeeAll = true,
  onSeeAllClick
}: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="section-header">{title}</h2>
      
      {showSeeAll && (
        <button 
          className="see-all" 
          onClick={onSeeAllClick}
        >
          See all
        </button>
      )}
    </div>
  );
}