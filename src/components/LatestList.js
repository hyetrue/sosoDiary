import LatestItem from "./LatestItem";

const LatestList = ({ latestList }) => {
  const latest = (a, b) => {
    return parseInt(b.date) - parseInt(a.date);
  };
  const copyList = JSON.parse(JSON.stringify(latestList));

  return (
    <div>
      {latest().map((it) => (
        <LatestItem key={it.id} {...it} />
      ))}
    </div>
  );
};

export default LatestList;
