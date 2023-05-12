import type { PageServerLoad, Actions } from './$types';
import { supabase } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';
let loadeddatainFormAction: string; // defined a variable so that I can load the vendorBalance only when action is triggered and not on page load
let newAmount: number;
export const actions: Actions = {
	payto: async ({ params, request }) => {
		const formdata = await request.formData();
		const amount = <string>(<unknown>formdata.get('amount')); // type casting the data.get('amount') to number to be able to assign to the variable

		const { data: loadData, error: loadErr } = await supabase
			.from('profiles')
			.select('balance')
			.eq('id', params.id)
			.single(); // Returns the data in a single object instead of an array(really cool find from the docs :D)
		if (loadErr) throw error(500, 'Oops! The transaction failed. Please try again later.');
		else loadeddatainFormAction = loadData.balance;

		newAmount = parseFloat(amount) + parseFloat(loadeddatainFormAction);

		const { error: err } = await supabase
			.from('profiles')
			.update({ balance: newAmount })
			.eq('id', params.id);

		if (err) throw error(500, 'Oops! The transaction failed. Please try again later.');
	}
};
//Loading username from a variable declared in root directory and also loading vendor balance and raw_user_meta_data from supabase
//based on dynamic route params
export const load: PageServerLoad = async ({ params, locals }) => {
	const { data, error: err } = await supabase
		.from('profiles')
		.select('raw_user_meta_data')
		.eq('id', params.id);

	if (err) throw error(404, "Couldn't find that user");
	else
		return {
			vendorData: data
		};
};