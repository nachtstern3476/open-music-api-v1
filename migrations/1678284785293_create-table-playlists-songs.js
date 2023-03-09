exports.up = pgm => {
    pgm.createTable('playlists_songs', {
        id: 'id',
        playlist_id: {
            type: 'TEXT',
            notNull: true
        },
        song_id: {
            type: 'TEXT',
            notNull: true
        }
    });
};

exports.down = pgm => {
    pgm.dropTable('playlists_songs');
};
