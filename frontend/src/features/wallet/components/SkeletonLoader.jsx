const SkeletonLoader = ({ className = "", style = {} }) => {
  return (
    <div
      className={`animate-pulse rounded bg-white/10 ${className}`}
      style={style}
    />
  );
};

export default SkeletonLoader;
