exports.up = pgm => {
    pgm.createTable('album_likes', {
        id: 'id',
        user_id: 'VARCHAR(50)',
        album_id: 'VARCHAR(50)'
    });

    pgm.addConstraint('album_likes', 'unique_user_id_and_album_id', 'UNIQUE(user_id, album_id)');

    pgm.addConstraint('album_likes', 'album_likes.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('album_likes', 'album_likes.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropTable('album_likes');
};
