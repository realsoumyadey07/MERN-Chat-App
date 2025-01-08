import Image from "next/image";
import { IoLockClosed } from "react-icons/io5";

export default function Chat() {
  return (
    <div>
      <div className="text-center mt-[60px]">
        <div className="flex justify-center items-center my-4">
          <Image src={"/images/whatsapp-logo.webp"} width={100} height={100} alt="whatsapp logo" />
        </div>
        <div>
          <h1>MERN Chat App for Web</h1>
        </div>
        <div>
          <p className="text-gray-500">
            Send and receive messages online with us.
          </p>
          <p className="text-gray-500">
            User MERN Chat App securly. We care about your privacy
          </p>
        </div>
      </div>
      <footer className="w-full mt-6">
        <div className="flex items-center justify-center text-gray-600">
          <IoLockClosed className="mr-2" />
          <p>End-to-end encrypted</p>
        </div>
      </footer>
    </div>
  );
}
