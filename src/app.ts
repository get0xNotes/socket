import { Server } from "socket.io";
import { PostgrestClient } from "@supabase/postgrest-js";
import * as jose from "jose";

const io = new Server({ cors: { origin: process.env.ORIGIN } });

async function validateSession(token: string) {
  const JWK = JSON.parse(process.env.SERVER_JWK);
  delete JWK.d;
  try {
    const { payload, protectedHeader } = await jose.jwtVerify(
      token,
      await jose.importJWK(JWK),
      { issuer: "0xNotes" }
    );
    return { valid: true, uname: payload.aud };
  } catch (e) {
    return { valid: false, uname: null };
  }
}

io.on("connection", (socket) => {
  socket.on("join", (auth: string, id: number) => {
    validateSession(auth).then((res) => {
      res.valid ? socket.join(id.toString()) : socket.disconnect();
    });
  });
  socket.on("leave", (auth, id) => {
    validateSession(auth).then((res) => {
      res.valid ? socket.leave(id.toString()) : socket.disconnect();
    });
  });
  socket.on("update", (auth, id, user, data) => {
    validateSession(auth).then((res) => {
      if (res.valid && res.uname == user) {
        // Broadcast data to all clients in room id
        io.to(id.toString()).emit("update", user, socket.id, data);

        // Update database
        const postgrest = new PostgrestClient(process.env.POSTGREST_ENDPOINT, {
          headers: { apikey: process.env.POSTGREST_APIKEY },
        });
        postgrest
          .from("notes")
          .update({
            keys: data.keys,
            title: data.title,
            content: data.content,
            modified: new Date().toISOString(),
            modifiedBy: user,
          })
          .eq("id", id)
          .then((res) => {
            console.log(res);
          });
      } else {
        socket.disconnect();
      }
    });
  });
});

io.listen(3000);
