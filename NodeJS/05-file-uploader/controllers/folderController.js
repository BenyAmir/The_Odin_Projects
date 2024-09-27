const prisma = require("../prisma/client");

const getRoot = async() => {
    return prisma.folder.findFirst({
        where: {
          name: process.env.DIRECTORY_ROOT_FOLDER,
          parent_id: null
        },
      });
}
exports.getDirectory = async (req, res) => {
  let { parent_id: directoryId } = req.query;
  if (!directoryId) {
    const root = await getRoot(); 
    directoryId = root.id;
  }

  const directory = await prisma.folder.findFirst({
    relationLoadStrategy: "join",
    where: {
      id: directoryId
    },
    include: {
      files: true,
      children: true
    },
  });

  res.render("panel", { directory });
};
exports.getFolder = async (req, res) => {
  const { parent_id } = req.query;

  return await prisma.folder.findUnique({
    where: {
      id: parent_id,
    },
  });
};

exports.createFolder = async (req, res) => {
  try {
    const { name, parent_id } = req.body;

    await prisma.folder.create({
      data: {
        name,
        parent_id: parent_id,
      },
    });
    res.redirect("/panel");
  } catch (error) {
    return res.status(400).render('message',{ message: error.message });
  } 
};

exports.backToParentDirectory = async (req, res) => {
  const { parent_id: id } = req.params;
  const folder = prisma.folder.findUnique({
    where: {
      id: id,
    },
  });

  const upLevelParentId = folder.parent_id;
  return await prisma.folder.findUnique({
    where: {
      parent_id: upLevelParentId,
    },
  });
};

exports.deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.folder.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    res.locals.error = error;
    res.redirect(req.path);
  }
};

exports.updateFolder = async (req, res) => {};
