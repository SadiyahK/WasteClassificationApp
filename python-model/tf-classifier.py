import matplotlib.pyplot as plt
from keras.preprocessing.image import ImageDataGenerator
from keras.models import Sequential
from keras.layers import Flatten
from keras.layers import Dense
from keras.layers import Convolution2D
from keras.layers import MaxPooling2D
from keras.layers import Dropout

#initialise sequential model
cf = Sequential()

#Creating the layers for the model
# extract features layer
cf.add(Convolution2D(128, (3, 3), input_shape = (256, 256,3), activation = 'relu'))
# extract features layers - don't need to specify size again as keras will know
cf.add(Convolution2D(64, (3, 3), activation = 'relu'))
# reduce the size
cf.add(MaxPooling2D(pool_size = (2, 2)))
# extract features layer
cf.add(Convolution2D(32, (3, 3), activation = 'relu'))
# reduce the size
cf.add(MaxPooling2D(pool_size = (2, 2)))
# extract features layer
cf.add(Convolution2D(32, (3, 3), activation = 'relu'))
# reduce the size
cf.add(MaxPooling2D(pool_size = (2, 2)))
# reduce to linear array
cf.add(Flatten())
#full connection - connect every neuron to every other neruon
cf.add(Dense(units = 128, activation = 'relu'))
# for output step
cf.add(Dense(units = 6, activation = 'softmax'))
# randomly ignore nodes
cf.add(Dropout(0.01))
#compile cnn
cf.compile(optimizer = 'adam', loss = 'categorical_crossentropy', metrics = ['accuracy'] )

#data augmentation
train_dataGen = ImageDataGenerator(horizontal_flip=True, rescale=1./255, zoom_range=0.2, shear_range=0.2)
validation_dataGen = ImageDataGenerator(rescale=1./255)
#  Preparing training and validation set.
training_set = train_dataGen.flow_from_directory('dataset-resized/training_set', target_size=(256, 256), 
                                             batch_size=32, class_mode='categorical')
validation_set = validation_dataGen.flow_from_directory('dataset-resized/test_set', target_size=(256, 256), 
                                            batch_size=32, class_mode='categorical')

# train model using generator method as dataset has augmentation
plot_compare = cf.fit_generator(training_set, steps_per_epoch=(2024/32), epochs=32, 
                                validation_data=validation_set, validation_steps=(503/32))
# save it for retraining later
cf.save('cnn-model')

#plot data on graphs
plt.plot(plot_compare.history['loss'])
plt.plot(plot_compare.history['val_loss'])
plt.title('Model Loss')
plt.ylabel('Loss')
plt.xlabel('Epoch')
plt.legend(['Train', 'Val'], loc='upper right')
plt.show()

plt.plot(plot_compare.history['accuracy'])
plt.plot(plot_compare.history['val_accuracy'])
plt.title('Model accuracy')
plt.ylabel('Accuracy')
plt.xlabel('Epoch')
plt.legend(['Train', 'Val'], loc='lower right')
plt.show()


####### TESTING THE MODEL ####### 
from keras.models import load_model

# reconstruct the model identically.
model = load_model('C:/Users/Sadiy/OneDrive/Documents/KCL/Y3/PRJ/dataset-resized/cnn-model')
# Prepare test set
test_dataGen = ImageDataGenerator(rescale=1./255)
test_set = test_dataGen.flow_from_directory('C:/Users/Sadiy/OneDrive/Documents/KCL/Y3/PRJ/dataset-resized/test-images-post-save', 
                                            target_size=(256, 256), batch_size=32, class_mode='categorical')

results = model.evaluate(test_set, batch_size=128)
print("test loss, test acc:", results)

# SAVE MODEL AS JSON+BIN FILES
import tensorflowjs as tfjs
tfjs.converters.save_keras_model(model, 'C:/Users/Sadiy/OneDrive/Documents/KCL/Y3/PRJ/dataset-resized/cnn-model-V1.2+10-resaved')

