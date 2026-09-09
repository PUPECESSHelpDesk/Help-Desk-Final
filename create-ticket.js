const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, topic, message } = JSON.parse(event.body);

    if (!name || !email || !topic || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields are required' })
      };
    }

    const { data, error } = await supabase
      .from('tickets')
      .insert({
        student_name: name,
        student_email: email,
        topic,
        message
      })
      .select()
      .single();

    if (error) throw error;

    return {
      statusCode: 201,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};