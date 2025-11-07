interface ContestDescriptionProps {
  description: string;
}

const ContestDescription = ({ description }: ContestDescriptionProps) => {
  return (
    <div className="px-1">
      <h3 className="text-lg font-semibold mb-2">Description</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
};

export default ContestDescription;

