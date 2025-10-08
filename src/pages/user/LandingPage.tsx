


// import React, { useState } from 'react';
// import homeHero from "../../assets/images/Homepage-BigHero-1200x500_2x.webp"
// import handShakeImg from "../../assets/images/ChatGPT_Image_Aug_2__2025__11_16_25_AM-removebg-preview 1.svg"

// import Navbar from '../../components/user/Navbar';
// import CreateRoomModal from '../../components/user/room/entry-related/CreateRoomModal';
// import RoomsSection from '../../components/user/room/entry-related/RoomsSection';
// import { useNavigate } from 'react-router-dom';

// const LandingPage: React.FC = () => {
//     const navigate = useNavigate();
//     const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

//     const handleCreateRoom = () => {
//         setIsCreateRoomModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsCreateRoomModalOpen(false);
//     };

//     return (
//         <>
//             <div className="min-h-screen bg-black text-white">
//                 {/* Navigation */}
//                 <Navbar />

//                 {/* Hero Section */}
//                 <section className="relative px-6 py-16 md:py-24">
//                     <div className="max-w-7xl mx-auto">
//                         <div className="grid md:grid-cols-2 gap-12 items-center">
//                             <div>
//                                 <h1 className="text-5xl md:text-6xl font-bold mb-6">
//                                     Code Together,<br />
//                                     <span className="text-green-400">Build Faster</span>
//                                 </h1>
//                                 <p className="text-xl text-gray-300 mb-8 max-w-lg">
//                                     Collaborate on code in real-time, with whiteboards and chat built-in.
//                                     Practice, build to live sessions when learning new topics.
//                                 </p>
//                                 <div className="flex space-x-4">
//                                     <button
//                                         onClick={handleCreateRoom}
//                                         className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold text-black transition-colors">
//                                         Create Room
//                                     </button>
//                                     <button 
//                                         className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-black px-6 py-3 rounded-lg font-semibold transition-colors">
//                                         Join Room
//                                     </button>
//                                 </div>
//                             </div>

//                             <img src={handShakeImg} alt="" />
//                         </div>
//                     </div>

//                     {/* Background geometric pattern */}
//                     <div className="absolute inset-0 overflow-hidden pointer-events-none">
//                         <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
//                         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
//                     </div>
//                 </section>

//                 {/* Built for Students Section */}
//                 <section className="px-6 py-16 bg-black">
//                     <div className="max-w-7xl mx-auto">
//                         <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
//                             BUILT FOR <span className="text-green-400">STUDENTS,</span>
//                         </h2>

//                         <div className="relative bg-black rounded-3xl p-8 overflow-hidden">
//                             <img
//                                 src={homeHero}
//                                 alt="Student coding"
//                             />
//                         </div>
//                     </div>
//                 </section>

//                 {/* Active Rooms Section */}
//                 <RoomsSection 
//                     title="Join Active Rooms" 
//                     status="active" 
//                     accentColor="green" 
//                 />

//                 {/* Upcoming Rooms Section */}
//                 <RoomsSection 
//                     title="Upcoming Scheduled Rooms" 
//                     status="waiting" 
//                     accentColor="blue" 
//                 />

//                 {/* Footer */}
//                 <footer className="px-6 py-8 bg-black border-t border-gray-700">
//                     <div className="max-w-7xl mx-auto text-center text-gray-400">
//                         <p>&copy; 2024 KodeCode. All rights reserved.</p>
//                     </div>
//                 </footer>
//             </div>

//             {/* Create Room Modal */}
//             <CreateRoomModal 
//                 isOpen={isCreateRoomModalOpen}
//                 onClose={handleCloseModal}
//             />
//         </>
//     );
// };

// export default LandingPage;

























import React, { useState } from 'react';
import homeHero from "../../assets/images/Homepage-BigHero-1200x500_2x.webp"
import handShakeImg from "../../assets/images/ChatGPT_Image_Aug_2__2025__11_16_25_AM-removebg-preview 1.svg"

import Navbar from '../../components/user/Navbar';
import CreateRoomModal from '../../components/user/room/entry-related/CreateRoomModal';
import JoinPrivateRoomModal from '../../components/user/room/entry-related/JoinPrivateRoomModal';
import RoomsSection from '../../components/user/room/entry-related/RoomsSection';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
    const [isJoinRoomModalOpen, setIsJoinRoomModalOpen] = useState(false);

    const handleCreateRoom = () => {
        setIsCreateRoomModalOpen(true);
    };

    const handleJoinRoom = () => {
        setIsJoinRoomModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateRoomModalOpen(false);
    };

    const handleCloseJoinModal = () => {
        setIsJoinRoomModalOpen(false);
    };

    return (
        <>
            <div className="min-h-screen bg-black text-white">
                {/* Navigation */}
                <Navbar />

                {/* Hero Section */}
                <section className="relative px-6 py-16 md:py-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                    Code Together,<br />
                                    <span className="text-green-400">Build Faster</span>
                                </h1>
                                <p className="text-xl text-gray-300 mb-8 max-w-lg">
                                    Collaborate on code in real-time, with whiteboards and chat built-in.
                                    Practice, build to live sessions when learning new topics.
                                </p>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={handleCreateRoom}
                                        className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold text-black transition-colors">
                                        Create Room
                                    </button>
                                    <button 
                                        onClick={handleJoinRoom}
                                        className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-black px-6 py-3 rounded-lg font-semibold transition-colors">
                                        Join Room
                                    </button>
                                </div>
                            </div>

                            <img src={handShakeImg} alt="" />
                        </div>
                    </div>

                    {/* Background geometric pattern */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
                    </div>
                </section>

                {/* Built for Students Section */}
                <section className="px-6 py-16 bg-black">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
                            BUILT FOR <span className="text-green-400">STUDENTS,</span>
                        </h2>

                        <div className="relative bg-black rounded-3xl p-8 overflow-hidden">
                            <img
                                src={homeHero}
                                alt="Student coding"
                            />
                        </div>
                    </div>
                </section>

                {/* Active Rooms Section */}
                <RoomsSection 
                    title="Join Active Rooms" 
                    status="active" 
                    accentColor="green" 
                />

                {/* Upcoming Rooms Section */}
                <RoomsSection 
                    title="Upcoming Scheduled Rooms" 
                    status="waiting" 
                    accentColor="blue" 
                />

                {/* Footer */}
                <footer className="px-6 py-8 bg-black border-t border-gray-700">
                    <div className="max-w-7xl mx-auto text-center text-gray-400">
                        <p>&copy; 2024 KodeCode. All rights reserved.</p>
                    </div>
                </footer>
            </div>

            {/* Create Room Modal */}
            <CreateRoomModal 
                isOpen={isCreateRoomModalOpen}
                onClose={handleCloseCreateModal}
            />

            {/* Join Private Room Modal */}
            <JoinPrivateRoomModal 
                isOpen={isJoinRoomModalOpen}
                onClose={handleCloseJoinModal}
            />
        </>
    );
};

export default LandingPage;
