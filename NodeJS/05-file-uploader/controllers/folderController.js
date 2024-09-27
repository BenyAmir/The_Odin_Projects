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

exports.createFolder = async (req, res) => {
  try {
    const { name, parent_id } = req.body;

    await prisma.folder.create({
      data: {
        name,
        parent_id,
      },
    });
    res.redirect("/panel");
  } catch (error) {
    return res.status(400).render('message',{ message: error.message });
  } 
};

exports.deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const folder = await prisma.folder.findFirst({
      where: {
        id,
      },
    });

    await prisma.folder.delete({
      where: {
        id,
      },
    });
    res.redirect(`/panel?parent_id=${folder.parent_id}`);
  } catch (error) {
    res.status(400).render('message'.error.message);
  }
};

exports.updateFolder = async (req, res) => {
  try {
    const {id} = req.params;
    const {name} = req.body;
    const folder = await prisma.folder.findFirst({
      where: {
        id,
      },
    });
    await prisma.folder.update({
      where:{
        id
      },
      data:{
        name
      }
    });
    res.redirect(`/panel?parent_id=${folder.parent_id}`);
  } catch (error) {
    res.status(400).render('message'.error.message);
  }
};
