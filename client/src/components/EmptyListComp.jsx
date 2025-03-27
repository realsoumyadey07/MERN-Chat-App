import Image from "next/image";
import NoContent from "../../public/images/no-contact.png";

export default function EmptyListComp({heading, description}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <Image
        src={NoContent} // Add an illustration for empty state
        alt="No contact found"
        className="w-32 h-26 mb-4"
      />
      <p className="text-gray-500 dark:text-gray-400">
        {heading}
      </p>
      <p className="text-sm text-gray-400 dark:text-gray-500">
        {description}
      </p>
    </div>
  );
}
