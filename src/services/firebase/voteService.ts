import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { db } from "./config";

export async function voteForRadio(radioId: string): Promise<number> {
  try {
    const radioRef = doc(db, "radioSuggestions", radioId);
    
    // Incrémenter le compteur de votes
    await updateDoc(radioRef, {
      votes: increment(1)
    });
    
    // Récupérer le nouveau nombre de votes
    const radioDoc = await getDoc(radioRef);
    const votes = radioDoc.data()?.votes || 0;
    
    console.log(`Vote enregistré pour la radio ${radioId}. Total: ${votes} votes`);
    return votes;
  } catch (error) {
    console.error("Error voting for radio:", error);
    throw error;
  }
}

export async function getRadioVotes(radioId: string): Promise<number> {
  try {
    const radioRef = doc(db, "radioSuggestions", radioId);
    const radioDoc = await getDoc(radioRef);
    
    return radioDoc.data()?.votes || 0;
  } catch (error) {
    console.error("Error getting radio votes:", error);
    return 0;
  }
}
