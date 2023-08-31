import { useDrag } from "react-dnd";
import {supabase} from "./supabaseClient.js";

const PullRequest = ({ card }) => {
   const [{isDragging}, ref] = useDrag(() => ({
      type: 'CARD',
      item: { card },
      end: (item, monitor) => {
        const dropRes = monitor.getDropResult();
        if (item && dropRes) {
           moveCard(item.card, dropRes.column);
        }
      },
      collect: (monitor) => ({
         isDragging: monitor.isDragging()
      })
   }));

   const moveCard = async (card, column) => {
      console.info(`Card #${card.id} go to column #${column.id}`);

      const {error} = await supabase
         .from('cards')
         .update({column_id: column.id})
         .eq('id', card.id);

      if (error) {
         console.error(error);
      }
   };

   return (
      <div className="card" ref={ref}>
         <div className={`${isDragging ? 'bg-red-400 cursor-grabbing' : 'bg-gray-100 cursor-grab'} shadow-md rounded-lg p-4 space-y-2 overflow-y-auto`}>
            <div className="text-black">
               <h2 className="text-lg font-semibold">{card.name}</h2>
               <p>
                  <a className="text-blue-500 hover:underline" href={card.url}>
                     {card.url}
                  </a>
               </p>
            </div>
         </div>
      </div>
   );
};

export default PullRequest;
