import { Link } from 'react-router-dom';
interface BreadcrumbProps {
  pageName: string;
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ pageName, className = '' }) => {
  return (
    <div className={`text-sm text-gray-500 dark:text-gray-300 ${className}`}>
      <span className="text-gray-400">Dashboard / </span>
      <span className="font-medium">{pageName}</span>
    </div>
  );
};

export default Breadcrumb;
