
const PreviewScreen = ({ html_code }) => {
  return (
    <div className=" bg-green-700 rounded-lg shadow-lg p-2">
      <div className="mx-auto h-[500px] max-h-[500px] overflow-y-hidden w-[70%]" dangerouslySetInnerHTML={{ __html: html_code }} />
    </div>
  );
};

export default PreviewScreen;
 