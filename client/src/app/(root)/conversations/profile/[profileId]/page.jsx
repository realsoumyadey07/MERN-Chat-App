import ConversationContainer from "@/components/shared/conversations/ConversationContainer";
import Image from "next/image";
import ProfileLogo from "../../../../../../public/images/profile.png"

export default function ProfileId({ children }) {
  const user = {
    profilePicture: "https://via.placeholder.com/150",
    username: "John Doe",
    email: "johndoe@example.com",
    about: "Full Stack Developer passionate about building web applications.",
  };
  return (
    <>
      <ConversationContainer>
        <div className="max-w-md mx-auto bg-transparent rounded-xl p-6">
          <div className="flex justify-center">
            <Image
              src={ProfileLogo}
              alt="Profile"
              height={100}
              width={100}
            />
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold">{user.username}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700">Username</h3>
            <p className="text-gray-600 mt-1">{user.username}</p>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700">Email</h3>
            <p className="text-gray-600 mt-1">{user.email}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700">About</h3>
            <p className="text-gray-600 mt-1">{user.about}</p>
          </div>
        </div>
      </ConversationContainer>
    </>
  );
}
