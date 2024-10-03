const prisma = require("../prisma/client");

exports.shareFolder = async (req, res) => {
  try {
    const { id: folderID } = req.params;
    const share = await prisma.shareFolder.create({
      data: {
        expire: new Date(req.body.expire),
        folder_id: folderID,
        owner_id: req.user.id,
      },
    });
    const link = req.get("host") + "/share/" + share.id;
    res.status(200).render("message", { message: `share link: ${link}` });
  } catch (error) {
    return res.status(400).render("message", { message: error.message });
  }
};
exports.getSharedFolder = async (req, res) => {
  try {
    const { id: sharedFolderID } = req.params;
    const shareFolder = await prisma.shareFolder.findFirstOrThrow({
        where: {
          id: sharedFolderID,
        },
        include: {
          folder: true,
          owner:true
        },
      })

      const directory = await prisma.folder.findFirst({
          where: {
            id: shareFolder.folder_id,
          },
          include: {
            children: true,
            files: true,
            share:true
          },
        });

    res.render("share", { directory, owner:shareFolder.owner });
  } catch (error) {
    return res.status(400).render("message", { message: error.message });
  }
};
