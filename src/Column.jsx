import PullRequest from "./PullRequest";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useDrop } from "react-dnd";

const Column = ({ session, column, size, index }) => {
	const [cards, setCards] = useState([]);

	const [, drop] = useDrop(() => ({
		accept: 'CARD',
		drop: () => ({ column })
	}), [column]);

	useEffect(() => {
		const ColumnsQuery = ``;
      async function getCards() {
         let { data, error } = await supabase
            .from("cards")
            .select("*")
            .eq("column_id", column.id);

         if (error) {
            console.warn(error);
         } else if (data) {
            setCards(data);
         }
      }

      const insert = supabase
         .channel("table-db-changes")
         .on(
            "postgres_changes", {
               event: "INSERT",
               schema: "public",
               table: "cards",
            },
            (payload) => console.info(payload, 'insert')
         )
         .subscribe();

		const udpdate = supabase
			.channel("table-db-changes")
			.on(
				"postgres_changes", {
					event: "UPDATE",
					schema: "public",
					table: "cards",
				},
				(payload) => getCards()
			)
			.subscribe();

      getCards();
   }, [session]);

	return (
		<div className={`flex-1 flex-grow `}>
			<div className="bg-white shadow-md p-4 rounded-lg h-full">
				<h2 className="text-lg font-semibold mb-2">
					{column.title}
				</h2>
				<div className="space-y-4 cards h-full" ref={drop}>
					{
						cards.length > 0
							? cards.map((card) => (<PullRequest key={card.id} card={card} />))
							: (<div className="text-center text-xl">Oh no! I'm empty 🥹</div>)
					}
				</div>
			</div>
		</div>
	)
}

export default Column;
