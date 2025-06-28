import React, { useState } from "react";
import { Search } from "lucide-react";
import mockEmojiData from "../data/mockEmojiData";

const emotes = mockEmojiData();

function EmoteModal({ emoteModal, emoteModalOpen }) {
  const [searchEmote, setSearchEmote] = useState("");
  const [filteredEmotes, setFilteredEmotes] = useState(emotes);

  const handleInputChange = (e) => {
    const searchEmote = e.target.value;
    setSearchEmote(searchEmote);

    // Filter based on the search term
    const filteredEmotes = emotes.map((group) => ({
      ...group,
      emotes: group.emotes.filter((emote) =>
        emote.name?.toLowerCase().includes(searchEmote.toLowerCase())
      ),
    })).filter(group => group.emotes.length > 0); // Only include groups with matches

    setFilteredEmotes(filteredEmotes);
  };

  return (
    <>
      {emoteModalOpen && (
        <div className="flex absolute bottom-20 right-[26%] w-[25%]">
          <div className="bg-[#93B2B6] z-10 drop-shadow-xl w-full max-h-[50vh] p-2 rounded-lg flex flex-col">
            <div className="relative mb-3">
              <Search className="absolute h-5 w-5 text-gray-400 top-1/4 left-2" />
              <input
                type="text"
                value={searchEmote}
                onChange={handleInputChange}
                placeholder="Search Emotes, Stickers & GIFs "
                className="pl-8 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="overflow-y-auto flex-1">
              <h2 className="font-semibold mb-2">Emojis</h2>
              {filteredEmotes.map((group, groupIdx) => (
                <div key={groupIdx} className="mb-4">
                  <h3 className="text-sm font-medium text-gray-600">
                    {group.category}
                  </h3>
                  <div className="grid grid-cols-8 gap-1">
                    {group.emotes.map((emote, emoteIdx) => (
                      <button
                        key={emoteIdx}
                        className="hover:bg-white hover:bg-opacity-20 rounded"
                      >
                        <span className="text-2xl">{emote.content}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <h2>Stickers</h2>
              <h2>Gifs</h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EmoteModal;
