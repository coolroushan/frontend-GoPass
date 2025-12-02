import React, { useEffect, useState } from "react";

import axios from "axios";

import {

  Search, Plus, Calendar, Filter, MoreVertical,

  Edit, Trash2, Clock, MapPin, ArrowRight

} from "lucide-react";

import AddEventModal from '../components/AddEventModal';

import EditEventModal from '../components/EditEventModal';



// Animation styles

const customStyles = `

  @keyframes fadeInUp {

    from { opacity: 0; transform: translateY(20px); }

    to { opacity: 1; transform: translateY(0); }

  }

  .animate-fade-in-up {

    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  }

`;



const Events = () => {

  const [events, setEvents] = useState([]); // Store API data

  const [loading, setLoading] = useState(true);

  const [filterType, setFilterType] = useState("All");

  const [searchQuery, setSearchQuery] = useState("");



  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);



  const BASE_URL=import.meta.env.VITE_API_BASE

  // --- API OPERATIONS ---



  // 1. Fetch Events

  const fetchEvents = async () => {

    try {

      const response = await axios.get(`${BASE_URL}/api/events`);

      setEvents(response.data);

      setLoading(false);

    } catch (error) {

      console.error("Error fetching events:", error);

      setLoading(false);

    }

  };



  useEffect(() => {

    fetchEvents();

  }, []);



  // 2. Create Event (Passed to AddModal)

// 2. Create Event (Passed to AddModal)
  const handleCreateEvent = async (newEventData) => {
    try {
      // FIX: Close the backtick string, then pass newEventData as the second argument
      await axios.post(`${BASE_URL}/api/events`, newEventData); 
      
      await fetchEvents(); // Refresh list
      setIsModalOpen(false);
      alert("Event Created Successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event.");
    }
  };



  // 3. Update Event (Passed to EditModal)

  const handleUpdateEvent = async (updatedEventData) => {

    try {

      // Use _id for MongoDB

      await axios.put(`${BASE_URL}/api/events/${updatedEventData._id}`, updatedEventData);

      await fetchEvents(); // Refresh list

      setIsEditModalOpen(false);

    } catch (error) {

      console.error("Error updating event:", error);

      alert("Failed to update event.");

    }

  };



  // 4. Delete Event (Attached to Trash Icon)

  const handleDeleteEvent = async (id) => {

    if (window.confirm("Are you sure you want to delete this event?")) {

      try {

        await axios.delete(`${BASE_URL}/api/events/${id}`);

        await fetchEvents(); // Refresh list

      } catch (error) {

        console.error("Error deleting event:", error);

        alert("Failed to delete event.");

      }

    }

  };



  // --- UI LOGIC ---



  const handleEditClick = (event) => {

    setSelectedEvent(event);

    setIsEditModalOpen(true);

  };



  // Filtering Logic

  const filteredEvents = events.filter(event => {

    const matchesSearch = event.title?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "All" || event.type === filterType;

    return matchesSearch && matchesType;

  });



  return (

    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-10 font-sans text-slate-900">

      <style>{customStyles}</style>



      {/* Page Header */}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 opacity-0 animate-fade-in-up">

        <div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1f3b] tracking-tight hover:tracking-wide transition-all duration-300 cursor-default">

            Event Management

          </h1>

          <p className="text-slate-500 mt-2 font-medium text-sm sm:text-base">

            Organize and track campus activities

          </p>

        </div>



        <button

          onClick={() => setIsModalOpen(true)}

          className="mt-4 md:mt-0 group relative px-6 py-3 bg-[#0b1f3b] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 overflow-hidden w-full md:w-auto"

        >

          <span className="relative z-10 flex items-center justify-center gap-2">

            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />

            Create New Event

          </span>

          <div className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>

        </button>

      </div>



      {/* Controls Container */}

      <div

        className="bg-white rounded-2xl p-4 sm:p-5 mb-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center opacity-0 animate-fade-in-up"

        style={{ animationDelay: '100ms' }}

      >

        <div className="relative w-full md:max-w-xs group">

          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

            <Search size={18} className="text-slate-400 group-focus-within:text-[#0b1f3b] transition-colors" />

          </div>

          <input

            type="text"

            placeholder="Search events..."

            value={searchQuery}

            onChange={(e) => setSearchQuery(e.target.value)}

            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200 sm:text-sm font-medium"

          />

        </div>



        <div className="flex p-1 bg-slate-100/80 rounded-xl w-full md:w-auto">

          {['All', 'One-Day', 'Multi-Day'].map((type) => (

            <button

              key={type}

              onClick={() => setFilterType(type)}

              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 ${

                filterType === type

                  ? 'bg-white text-[#0b1f3b] shadow-sm scale-100'

                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'

              }`}

            >

              {type}

            </button>

          ))}

        </div>

      </div>



      {/* Events List */}

      <div

        className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden opacity-0 animate-fade-in-up flex flex-col"

        style={{ animationDelay: '200ms' }}

      >

        {loading ? (

           <div className="p-10 text-center text-slate-500 font-medium">Loading events...</div>

        ) : (

          <>

            {/* --- DESKTOP VIEW --- */}

            <div className="hidden md:block overflow-x-auto">

              <table className="w-full text-left border-collapse">

                <thead>

                  <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-100">

                    <th className="px-8 py-5">Event Title</th>

                    <th className="px-6 py-5">Host Name</th>

                    <th className="px-6 py-5 text-center">Type</th>

                    <th className="px-6 py-5">Date Range</th>

                    <th className="px-6 py-5 text-center">Status</th>

                    <th className="px-8 py-5 text-right">Action</th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredEvents.map((event) => (

                    <tr

                      key={event._id} // Use _id from MongoDB

                      className="group hover:bg-white relative transition-all duration-300 ease-out hover:shadow-lg hover:shadow-blue-900/5 hover:z-10 hover:-translate-y-0.5 border-l-4 border-transparent hover:border-l-[#facc15]"

                    >

                      <td className="px-8 py-5">

                        <div className="flex items-center">

                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-sm group-hover:bg-[#0b1f3b] group-hover:text-[#facc15] transition-colors duration-300">

                            <Calendar size={18} />

                          </div>

                          <div className="ml-4">

                            <p className="text-sm font-bold text-[#0b1f3b] group-hover:text-blue-700 transition-colors">{event.title}</p>

                            <div className="flex items-center text-xs text-slate-400 mt-0.5">

                                <MapPin size={10} className="mr-1" /> {event.location}

                            </div>

                          </div>

                        </div>

                      </td>

                     

                      <td className="px-6 py-5">

                        <div className="text-sm font-semibold text-slate-600 group-hover:text-slate-800">

                            {event.host}

                        </div>

                      </td>



                      <td className="px-6 py-5 text-center whitespace-nowrap">

                        <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold border ${

                          event.type === 'One-Day'

                            ? 'bg-blue-50 text-blue-700 border-blue-100 group-hover:bg-blue-100'

                            : 'bg-indigo-50 text-indigo-700 border-indigo-100 group-hover:bg-indigo-100'

                        } transition-colors`}>

                          {event.type}

                        </span>

                      </td>



                      <td className="px-6 py-5">

                        <div className="flex flex-col text-xs font-medium text-slate-500">

                            <span className="flex items-center gap-2">

                                <span className="w-10 text-slate-400">Start:</span>

                                <span className="text-slate-700">{event.startDate}</span>

                            </span>

                            <span className="flex items-center gap-2 mt-1">

                                <span className="w-10 text-slate-400">End:</span>

                                <span className="text-slate-700">{event.endDate}</span>

                            </span>

                        </div>

                      </td>



                      <td className="px-6 py-5 text-center">

                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${

                          event.status === 'Upcoming' || event.status === 'Confirmed'

                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'

                            : event.status === 'Running'

                            ? 'bg-amber-50 text-amber-700 border border-amber-100'

                            : 'bg-slate-50 text-slate-500 border border-slate-200'

                        }`}>

                          <span className={`w-2 h-2 rounded-full mr-2 ${

                            event.status === 'Upcoming' || event.status === 'Confirmed' ? 'bg-emerald-500 animate-pulse'

                            : event.status === 'Running' ? 'bg-amber-500'

                            : 'bg-slate-400'

                          }`}></span>

                          {event.status}

                        </div>

                      </td>



                      <td className="px-8 py-5 text-right">

                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">

                            <button

                            onClick={() => handleEditClick(event)}

                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">

                                <Edit size={16} />

                            </button>

                            <button

                            onClick={() => handleDeleteEvent(event._id)} // Delete Action

                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">

                                <Trash2 size={16} />

                            </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>



              {filteredEvents.length === 0 && (

                <div className="p-10 text-center text-slate-400">

                    <Filter size={40} className="mx-auto mb-4 opacity-50" />

                    <p>No events found matching your criteria.</p>

                </div>

              )}

            </div>



            {/* --- MOBILE VIEW --- */}

            <div className="md:hidden flex flex-col divide-y divide-slate-100">

              {filteredEvents.map((event) => (

                <div key={event._id} className="p-5 bg-white hover:bg-slate-50 transition-colors">

                  <div className="flex justify-between items-start mb-3">

                    <div className="flex-1">

                        <h3 className="text-sm font-bold text-[#0b1f3b] mb-1">{event.title}</h3>

                        <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${

                          event.status === 'Upcoming' || event.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-500'

                        }`}>

                          {event.status}

                        </div>

                    </div>

                    <button className="text-slate-300 p-1">

                      <MoreVertical size={18} />

                    </button>

                  </div>



                  <div className="flex items-center justify-between mb-4">

                      <div className="text-xs text-slate-500">

                          <span className="block font-medium text-slate-400 uppercase tracking-wider text-[10px]">Host</span>

                          <span className="font-semibold text-slate-700">{event.host}</span>

                      </div>

                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border whitespace-nowrap ${

                        event.type === 'One-Day'

                          ? 'bg-blue-50 text-blue-700 border-blue-100'

                          : 'bg-indigo-50 text-indigo-700 border-indigo-100'

                      }`}>

                        {event.type}

                      </span>

                  </div>



                  <div className="pt-3 border-t border-slate-50 flex justify-between items-center">

                      <div className="flex flex-col text-xs text-slate-500 font-medium">

                          <div className="flex items-center mb-1">

                            <Clock size={12} className="mr-1.5" /> {event.startDate}

                          </div>

                          {event.type === 'Multi-Day' && (

                              <div className="flex items-center">

                                <ArrowRight size={10} className="mr-1.5 text-slate-300" /> {event.endDate}

                              </div>

                          )}

                      </div>

                     

                      <div className="flex gap-2">

                        <button

                        onClick={() => handleEditClick(event)}

                        className="p-1.5 text-blue-600 bg-blue-50 rounded-md">

                            <Edit size={14} />

                        </button>

                        <button

                        onClick={() => handleDeleteEvent(event._id)}

                        className="p-1.5 text-red-600 bg-red-50 rounded-md">

                            <Trash2 size={14} />

                        </button>

                      </div>

                  </div>

                </div>

              ))}

            </div>

          </>

        )}

      </div>



      <AddEventModal

         isOpen={isModalOpen}

         onClose={() => setIsModalOpen(false)}

         onSubmit={handleCreateEvent} // Pass API handler

       />



       <EditEventModal

            isOpen={isEditModalOpen}

            onClose={() => setIsEditModalOpen(false)}

            onUpdate={handleUpdateEvent} // Pass API handler

            eventData={selectedEvent}

        />

    </div>

  );

};



export default Events;