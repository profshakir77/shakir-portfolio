// Student project image upload. The handler parses multipart itself,
// so Next's JSON body parser must be off for this route.
import handler from '../../lib/upload-handler';

export const config = { api: { bodyParser: false } };
export default handler;
